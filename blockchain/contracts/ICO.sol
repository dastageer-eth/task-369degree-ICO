// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ICO is Ownable {
    IERC20 public token;
    IERC20 public usdt;
    IERC20 public usdc;
    uint256 public ethUSDPrice = 2000 * 10 ** 18; // Example ETH price in USD cents to maintain precision
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
    ) public icoActive icoNotEnded {
        uint256 tokenAmount = tokenCount * 10 ** 18; // Convert tokenCount to 18 decimals for token
        require(
            token.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );

        uint256 usdtToSell = tokenCount * 10 ** 6; // Adjust tokenCount to 6 decimals for USDT transfer
        require(
            usdtToSell <= usdt.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold -= usdtToSell;
        usdt.transfer(msg.sender, usdtToSell);

        emit TokensSold(msg.sender, tokenCount, address(usdt));
    }

    function buyTokensWithUSDT(
        uint256 tokenCount
    ) public icoActive icoNotEnded {
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
    ) public icoActive icoNotEnded {
        uint256 tokenAmount = tokenCount * 10 ** 18; // Convert tokenCount to 18 decimals for token
        require(
            token.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );

        uint256 usdcToSell = tokenCount * 10 ** 6; // Adjust tokenCount to 6 decimals for USDC transfer
        require(
            usdcToSell <= usdt.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold -= usdcToSell;
        usdt.transfer(msg.sender, usdcToSell);

        emit TokensSold(msg.sender, tokenCount, address(usdc));
    }

    function buyTokensWithUSDC(
        uint256 tokenCount
    ) public icoActive icoNotEnded {
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

    function buyTokensWithETH() public payable icoActive icoNotEnded {
        uint256 tokenCount = (msg.value * ethUSDPrice) / 1 ether; // Convert ETH sent to tokenCount
        uint256 tokensToBuy = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token transfer
        require(
            tokensToBuy <= token.balanceOf(address(this)),
            "Not enough tokens available"
        );

        tokensSold += tokensToBuy;
        token.transfer(msg.sender, tokensToBuy);

        emit TokensPurchased(msg.sender, tokenCount, address(0)); // Zero address for ETH
    }

    function sellTokensForETH(uint256 tokenCount) public icoActive icoNotEnded {
        uint256 tokensToSell = tokenCount * 10 ** 18; // Adjust tokenCount to 18 decimals for token precision
        require(
            token.balanceOf(msg.sender) >= tokensToSell,
            "Not enough tokens to sell"
        );
        require(
            token.transferFrom(msg.sender, address(this), tokensToSell),
            "Token transfer failed"
        );

        uint256 ethAmount = (tokensToSell * 1 ether) / ethUSDPrice; // Calculate ETH amount to be returned
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

    // Emergency stop function to forcefully end the ICO
    function emergencyStop() public onlyOwner {
        icoEnded = true;
    }

    function remainingTokens() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
