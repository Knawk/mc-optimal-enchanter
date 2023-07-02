# Enchant optimally!

Live site: <https://enchant.knawk.net>

This web-based tool helps determine how to combine Minecraft enchantments optimally - that is, using the minimum amount of experience.

## How it works

Given a set of desired enchantments, this tool computes the cheapest way to obtain every subset of the desired enchantments using dynamic programming.
In particular, the tool computes the cheapest way to obtain all size-2 subsets at all possible prior work counts;
then it uses those results to do the same for all size-3 subsets at all possible prior work counts;
and so on up to the full set of desired enchantments.

It's necessary to compute the cost of enchantment subsets _at all possible prior work counts_ because of how the prior work count factors into the cost.
The XP cost to combine two items in an anvil depends on not only the sacrified item's enchantment level cost, but also both items' prior work penalty.
The combined item's prior work count, on the other hand, only depends on the greater of the two combined items' prior work counts.
See the Minecraft Wiki's section on [Anvil mechanics - Combining items](https://minecraft.fandom.com/wiki/Anvil_mechanics?so=search#Combining_items) for details.

## See also

- virb3's [Minecraft Anvil Calculator](https://virb3.github.io/anvil-calc/): the only faster enchantment calculator that I know of (and it has extra features too)
