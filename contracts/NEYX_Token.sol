// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NEYX_Token is ERC20, ERC20Burnable, ERC20Permit, Ownable, ReentrancyGuard {

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor (address initialOwner,  address[] memory initialWallets, uint256[] memory initialBalances)
        
        ERC20("NEYX_Token", "NEYXT")
        ERC20Permit("NEYX_Token")
        Ownable(initialOwner){
        
        require(initialWallets.length == initialBalances.length,"Wallets and balances length mismatch");

        uint256 totalSupplyAllocated = 0;
        // Mint the total supply and allocate to specified wallets
        for (uint256 i = 0; i < initialWallets.length; i++) {
            totalSupplyAllocated += initialBalances[i];
            require(
                totalSupplyAllocated <= MAX_SUPPLY,
                "Total allocation exceeds MAX_SUPPLY"
            );
            _mint(initialWallets[i], initialBalances[i]);
        }

        // Ensure the entire MAX_SUPPLY is allocated
        require(
            totalSupplyAllocated == MAX_SUPPLY,
            "Total allocation must equal MAX_SUPPLY"
        ); 
    }

    // Burn function for owner
    function controlledBurn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }
}