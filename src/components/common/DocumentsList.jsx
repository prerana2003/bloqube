import React from "react";
import { bloqcibeApi, useGetTrialDocumentsQuery } from "../../store/slices/apiSlice";
import {
  Box,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import TableHeading from "./TableHeading";
import TableCellLabel from "./TableCellLabel";
import _ from 'lodash'
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const DocumentsList = ({ trialId, sponsorId, siteId, userId }) => {
  const data = { siteId: siteId, userId: userId };
  const { data: docList } = useGetTrialDocumentsQuery({
    trialId,
    sponsorId,
    data,
  });
  const [getDownloadTrialDoc] =
  bloqcibeApi.endpoints.getDownloadTrialDoc.useLazyQuery();
  const extractFilenameFromKey = (key) => {
    // Split the key by '/'
    const parts = key.split("/");
    // Get the last part (filename)
    const filename = parts[parts.length - 1];
    return filename;
  };
  const downloadDoc = async (s3Key) => {
    await getDownloadTrialDoc({
      trialId,
      s3Key,
      fileName: extractFilenameFromKey(s3Key),
      sponsorId: sponsorId,
    });
  };
  return (
    <Box>
      {docList && docList.length>0 &&<TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <TableHeading label={"Document Name"} />
              </TableCell >
              <TableCell align="center" sx={{maxWidth:200}}>
                <TableHeading label={"Document Category"} />
              </TableCell>
              <TableCell align="center">
                <TableHeading label={"Document Version"} />
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docList &&
              _.map(docList, (doc) => {
                return (
                  <TableRow
                    key={doc?.id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell align="center">
                      <TableCellLabel label={doc?.docName} />
                    </TableCell>
                    <TableCell align="center">
                      <TableCellLabel label={doc?.category} />
                    </TableCell>
                    <TableCell align="center">
                      <TableCellLabel label={doc?.docVersion} />
                    </TableCell>
                    <TableCell>
                    <Tooltip title={"Download"}>
                            <IconButton
                              onClick={() => downloadDoc(doc.docS3Key)}
                              color="primary"
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                          </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>}
    </Box>
  );
};

export default DocumentsList;
