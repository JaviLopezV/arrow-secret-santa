"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Link,
  LanguageSelector,
} from "@jlopvil/mui-kit";
import NorthEastRounded from "@mui/icons-material/NorthEastRounded";
import { useRouter } from "next/navigation";
import type { Locale, Messages } from "@/i18n/messages";

export function Header({ locale, m }: { locale: Locale; m: Messages }) {
  const router = useRouter();
  return (
    <Box component="header" sx={{ borderBottom: "1px solid #deded3" }}>
      <Link className="skip-link" href="#main">
        {m.nav.skip}
      </Link>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ minHeight: 88, gap: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "#fff",
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
              }}
            >
              <NorthEastRounded />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 21,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-.04em",
                }}
              >
                arrow
              </Typography>
              <Typography
                sx={{ fontSize: 11, letterSpacing: ".12em", fontWeight: 700 }}
              >
                SECRET SANTA
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Link
              href="#how"
              underline="hover"
              sx={{
                display: { xs: "none", sm: "inline" },
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {m.nav.how}
            </Link>
            <LanguageSelector<Locale>
              value={locale}
              label={m.nav.language}
              options={[
                { value: "es", label: "Español" },
                { value: "ca", label: "Català" },
                { value: "en", label: "English" },
              ]}
              onChange={(next) =>
                router.push(
                  `/${next}${window.location.search}${window.location.hash}`,
                )
              }
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
