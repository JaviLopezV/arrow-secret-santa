import Image from "next/image";
import { Box, Button, Stack, Typography } from "@jlopvil/mui-kit";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import type { Messages } from "@/i18n/messages";

export function Hero({ m }: { m: Messages }) {
  return (
    <Box sx={{ pt: { xs: 0, md: 5 }, position: "relative" }}>
      <Typography
        variant="overline"
        color="secondary.main"
        sx={{ letterSpacing: ".14em", fontSize: 11, fontWeight: 800 }}
      >
        {m.hero.eyebrow}
      </Typography>
      <Typography
        component="h1"
        variant="h1"
        sx={{ fontSize: { xs: 49, sm: 66, md: 64 }, mt: 2, maxWidth: 520 }}
      >
        {m.hero.title}
        <Box
          component="span"
          sx={{ color: "secondary.main", display: "block" }}
        >
          {m.hero.accent}
        </Box>
      </Typography>
      <Typography
        sx={{
          mt: 3,
          maxWidth: 410,
          fontSize: 18,
          lineHeight: 1.8,
          color: "#65756a",
        }}
      >
        {m.hero.description}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3 }}>
        <AutoAwesomeRounded sx={{ fontSize: 18, color: "secondary.main" }} />
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
          {m.hero.badge}
        </Typography>
      </Stack>
      <Button
        href="#draw"
        variant="contained"
        sx={{ mt: 3, display: { xs: "inline-flex", md: "none" } }}
      >
        {m.hero.action}
      </Button>
      <Box sx={{ maxWidth: 460, mx: "auto", mt: { xs: 1, md: 3 } }}>
        <Image
          src="/gift.svg"
          alt={m.hero.art}
          width={460}
          height={330}
          priority
          style={{ width: "100%", height: "auto" }}
        />
        <Typography
          sx={{
            maxWidth: 260,
            mx: "auto",
            textAlign: "center",
            fontSize: 13,
            color: "#65756a",
            fontStyle: "italic",
          }}
        >
          {m.hero.note}
        </Typography>
      </Box>
    </Box>
  );
}
