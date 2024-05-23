// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IERC20.sol";

contract SimpleStakingWithReferral {
    IERC20 public stakingToken;
    uint256 public constant maxReferrals = 10; // Maximum referrals to count for a full token reward

    mapping(address => uint256) public referralCount;
    mapping(address => bool) public hasClaimedReward; // To ensure one-time reward claim per user, if needed

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    // Adding referrals with validation
    function addReferral(uint256 count) public {
        require(count > 0, "Referral count must be positive");
        require(
            referralCount[msg.sender] + count <= maxReferrals,
            "Exceeds maximum referrals"
        );
        referralCount[msg.sender] += count;
    }

    // Claiming reward based on referral counts, only once if needed
    function claimReward() public {
        require(!hasClaimedReward[msg.sender], "Reward already claimed");
        uint256 numberOfReferrals = referralCount[msg.sender];
        uint256 rewardAmount = (numberOfReferrals * (stakingToken.decimals())) /
            maxReferrals; // Calculates the reward based on the number of referrals
        require(rewardAmount > 0, "No rewards available");

        hasClaimedReward[msg.sender] = true;
        stakingToken.transfer(msg.sender, rewardAmount);
    }

    // Stake tokens based on a simple integer input
    function stake(uint256 tokenCount) external {
        uint256 amount = tokenCount * 10 ** stakingToken.decimals(); // Assuming the token has 18 decimals
        require(amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    // Withdraw staked tokens
    function withdraw(uint256 tokenCount) public {
        uint256 amount = tokenCount * stakingToken.decimals(); // Assuming the token has 18 decimals
        require(amount > 0, "Cannot withdraw 0");
        stakingToken.transfer(msg.sender, amount);
    }

    // View total referrals of a specific account
    function totalReferrals(address account) public view returns (uint256) {
        return referralCount[account];
    }
}
