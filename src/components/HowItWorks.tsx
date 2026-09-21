import { Box, Stack, Typography } from "@jlopvil/mui-kit";
import PeopleOutlineRounded from "@mui/icons-material/PeopleOutlineRounded";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import RedeemRounded from "@mui/icons-material/RedeemRounded";
import type { Messages } from "@/i18n/messages";
const icons = [PeopleOutlineRounded, ShuffleRounded, RedeemRounded];

export function HowItWorks({ m }: { m: Messages }) {
  return (
    <Box
      component="section"
      id="how"
      sx={{ pt: 8, pb: 7, borderTop: "1px solid #e4d7c9", scrollMarginTop: 24 }}
    >
      <Typography
        component="h2"
        variant="h2"
        sx={{ fontSize: { xs: 28, sm: 34 }, textAlign: "center" }}
      >
        {m.how.title}
      </Typography>
      <Typography sx={{ textAlign: "center", color: "#65756a", mt: 1 }}>
        {m.how.subtitle}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          mt: 5,
        }}
      >
        {m.how.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <Stack key={step.title} direction="row" spacing={2}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  flexShrink: 0,
                  borderRadius: 3,
                  bgcolor: "#f8e8d5",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "secondary.main",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  0{index + 1}
                </Typography>
                <Typography
                  component="h3"
                  sx={{ fontSize: 18, fontWeight: 750, my: 0.5 }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, lineHeight: 1.7, color: "#65756a" }}
                >
                  {step.text}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
