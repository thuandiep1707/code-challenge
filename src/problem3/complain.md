# Wallet Page Issues

1. Missing field in type: `WalletBalance` does not have `blockchain`, but the code uses `balance.blockchain`. Add `blockchain` to the type.
2. Weak type in `getPriority`: it uses `any`. Use a string union like `'Osmosis' | 'Ethereum' | ...'`.
3. Type mismatch for `formatted`: `formattedBalances` creates `formatted`, but `rows` uses `formatted` from `sortedBalances`. `sortedBalances` has no `formatted`.
4. Price map not typed: `prices[balance.currency]` assumes a number map. Add a type and a fallback when key is missing.
5. Wrong variable name in filter: code uses `lhsPriority` (not defined). It should use `balancePriority`.
7. Sort comparator incomplete: no `return 0` when priorities are equal. Sorting can be unstable.
9. Unneeded recompute in `useMemo`: it depends on `prices`, but sorting uses only priority. Remove or split dependencies.
12. `children` not used: `children` is taken from props but not rendered. Remove it or render it.
15. Unstable list key: using `index` as React key. Use a stable key like `currency + blockchain`.
16. Domain rule inside component: `getPriority` is business logic. Move it outside for reuse and tests.
18. Tie-breaking missing: same priority (e.g., `Neo` and `Zilliqa`) needs a second sort key like `currency`.
19. Missing guard for price: `usdValue` can be `NaN` if price is missing. Add a check or default value.
20. Number format fixed to 0 decimals: `amount.toFixed()` shows 0 decimals. Use the correct precision per token.
