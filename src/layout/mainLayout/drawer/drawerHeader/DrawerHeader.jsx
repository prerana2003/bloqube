import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";

// project import
import DrawerHeaderStyled from "./DrawerHeaderStyled";
import Logo from "../../../../components/Logo/Logo";
import SponsorLogo from "../../../../components/Logo/SponsorLogo";
import { useSelector } from "react-redux";

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();
  const key = useSelector((state) => state.userDetails.user?.logoS3Key);
  const sponsorId = useSelector((state) => state.userDetails.user?.id);
  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        {key && sponsorId ? (
          <SponsorLogo s3Key={key} sponsorId={sponsorId} />
        ) : (
          <Logo />
        )}
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool,
};

export default DrawerHeader;
