import { Typography } from "@mui/material";

const PageHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <Typography
        variant="h4"
        component="h1"
        color="primary"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        {children}
      </Typography>
    )
}

export default PageHeader