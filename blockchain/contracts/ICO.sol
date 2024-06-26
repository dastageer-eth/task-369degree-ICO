// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ICO is Ownable, ReentrancyGuard {
    IERC20 public token;
    IERC20 public usdt;
    IERC20 public usdc;
    uint256 public ethUSDPrice = 2000; // Example ETH price in USD cents to maintain precision
    uint256 public endICO;
    bool public icoEnded = false;
    uint256 public tokensSold;

    event TokensPurchased(
        address indexed buyer,
        uint256 tokenCount,
        address indexed currencyUsed
    );
    event TokensSold(
        address indexed buyer,
        uint256 tokenCount,
        address indexed currencyUsed
    );
    event ICOEnded(address indexed owner, uint256 amountRaised);

    constructor(
        IERC20 _token,
        IERC20 _usdt,
        IERC20 _usdc,
        uint256 _duration
    ) Ownable(msg.sender) {
        require(_duration > 0, "Duration must be greater than 0");

        token = _token;
        usdt = _usdt;
        usdc = _usdc;
        endICO = block.timestamp + _duration;
    }

    modifier icoActive() {
        require(block.timestamp < endICO && !icoEnded, "ICO is not active");
        _;
    }

    modifier icoNotEnded() {
        require(!icoEnded, "ICO has ended");
        _;
    }

    function sellTokensWithUSDT(
        uint256 tokenCount
    ) public nonReentrant icoActive icoNotEnded {
        uint256 tokenAmount = tokenCount * 10 ** 18; // Convert tokenCount to 18 decimals for token
        require(
            token.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );

        uint256 usdtToSell = tokenCount * 10 ** 6; // Convert to 6 decimals for USDT
        require(
            usdtToSell <= usdt.balanceOf(address(this)),
            "Not enough USDT available"
        );

        tokensSold -= tokenAmount;
        usdt.transfer(msg.sender, usdtToSell);

        emit TokensSold(msg.sender, tokenCount, address(usdt));
    }

    function buyTokensWithUSDT(
        uint256 tokenCount
    ) public nonReentrant icoActive icoNotEnded {
        uint256 usdtAmount = tokenCount * 10 ** 6; // Convert tokenCount to 6 decimals for USDT
        require(
            usdt.transferFrom(msg.sender, address(this), usdtAmount),
            "USDT transfer failed"
        );

        uint256 tokensToBuy = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token transfer
        require(
            tokensToBuy <= token.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold += tokensToBuy;
        token.transfer(msg.sender, tokensToBuy);

        emit TokensPurchased(msg.sender, tokenCount, address(usdt));
    }

    function sellTokensWithUSDC(
        uint256 tokenCount
    ) public nonReentrant icoActive icoNotEnded {
        uint256 tokenAmount = tokenCount * 10 ** 18; // Convert tokenCount to 18 decimals for token
        require(
            token.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );

        uint256 usdcToSell = tokenCount * 10 ** 6; // Convert to 6 decimals for USDC
        require(
            usdcToSell <= usdc.balanceOf(address(this)),
            "Not enough USDC available"
        );

        tokensSold -= tokenAmount;
        usdc.transfer(msg.sender, usdcToSell);

        emit TokensSold(msg.sender, tokenCount, address(usdc));
    }

    function buyTokensWithUSDC(
        uint256 tokenCount
    ) public nonReentrant icoActive icoNotEnded {
        uint256 usdcAmount = tokenCount * 10 ** 6; // Convert tokenCount to 6 decimals for USDC
        require(
            usdc.transferFrom(msg.sender, address(this), usdcAmount),
            "USDC transfer failed"
        );

        uint256 tokensToBuy = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token transfer
        require(
            tokensToBuy <= token.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold += tokensToBuy;
        token.transfer(msg.sender, tokensToBuy);

        emit TokensPurchased(msg.sender, tokenCount, address(usdc));
    }

    function buyTokensWithETH()
        public
        payable
        nonReentrant
        icoActive
        icoNotEnded
    {
        uint256 ethInUSD = (msg.value * ethUSDPrice) / 1 ether; // Convert ETH to USD cents
        uint256 tokenCount = ethInUSD / 100; // 1 token per dollar
        uint256 tokensToBuy = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token transfer
        require(
            tokensToBuy <= token.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold += tokensToBuy;
        token.transfer(msg.sender, tokensToBuy);

        emit TokensPurchased(msg.sender, tokenCount, address(0)); // Zero address for ETH
    }

    function sellTokensForETH(
        uint256 tokenCount
    ) public nonReentrant icoActive icoNotEnded {
        uint256 tokensToSell = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token precision
        require(
            token.balanceOf(msg.sender) >= tokensToSell,
            "Not enough tokens to sell"
        );
        require(
            token.transferFrom(msg.sender, address(this), tokensToSell),
            "Token transfer failed"
        );

        // Calculate ETH amount to be returned based on the ETH price in USD
        // ethUSDPrice is assumed to be in the same precision as token count (18 decimals)
        uint256 ethAmount = (tokensToSell / ethUSDPrice) * 100; // Adjust precision for ethUSDPrice

        require(
            address(this).balance >= ethAmount,
            "Not enough ETH in reserve"
        );

        payable(msg.sender).transfer(ethAmount);
        tokensSold -= tokensToSell;

        emit TokensSold(msg.sender, tokenCount, address(0));
    }

    function terminateICO() public onlyOwner icoNotEnded {
        icoEnded = true;
        token.transfer(owner(), token.balanceOf(address(this)));
        usdt.transfer(owner(), usdt.balanceOf(address(this)));
        usdc.transfer(owner(), usdc.balanceOf(address(this)));
        payable(owner()).transfer(address(this).balance);

        emit ICOEnded(
            owner(),
            usdt.balanceOf(address(this)) +
                usdc.balanceOf(address(this)) +
                address(this).balance
        );
    }

    function emergencyStop() public onlyOwner {
        icoEnded = true;
    }

    function remainingTokens() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    receive() external payable {}
}
