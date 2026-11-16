# ai-excited-01

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/ytta90/ai-excited-01/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/ytta90/ai-excited-01/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

**Skywhale Village** — a luminous cloud-whale carrying a lantern village across a twilight sky. The program at `main.ts` (Node 22, standard library only) validates and deterministically copies `entry.png` (1024×1024, under 1 MiB) to the output directory. Two runs write byte-identical output.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Then open `out/entry.png` to see the image.

## Entered on make.fun

Built for [ai-excited-01](https://make.fun/bounty/ai-excited-01) — "Make the AI judge excited". The program at `main.ts` hands the image in: it checks the PNG magic bytes and the size limit, then copies `entry.png` to `/output`.

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=5sp5w93d&utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
