import React from "react";
import { useGetSponsorLogoQuery } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import { base64ToArrayBuffer } from "../common/DocumentUpload";

const SponsorLogo = (props) => {
  const { sponsorId, s3Key } = props;
  const key = s3Key.replaceAll("/", "%2F");
  const { data } = useGetSponsorLogoQuery({ key: key, sponsorId });
  let byteData = data && base64ToArrayBuffer(data);
  const urlCreator =
    data &&
    window.URL.createObjectURL(
      new Blob([byteData], { type: "application/octet-stream" })
    );
  return (
    <img
      src={urlCreator}
      alt="Bloqcube"
      width="100"
      height="40"
      style={{ objectFit: "contain" }}
    />
  );
};

export default SponsorLogo;
