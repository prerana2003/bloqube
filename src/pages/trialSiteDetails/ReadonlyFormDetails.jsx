
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DynamicFormEngine from '../dynamicFormEngine';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { bloqcibeApi, useGetTrialSiteInfoQuery } from '../../store/slices/apiSlice';
import { getUserRole } from '../util';

const ReadonlyFormDetails = (props) => {
    const { open, handleClose, title, step, trialId, sponsorId, trialSiteId } = props;
    const [formConfig, setFormConfig] = useState(null);
    const loggedInUser = useSelector((state) => state.auth.user);
    const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
    const [userSiteTrialRole, setUserSiteTrialRole] = useState();
    const { data: trialSiteinfo } = useGetTrialSiteInfoQuery({
        sponsorId: sponsorId,
        trialId: trialId,
        siteTrialId: trialSiteId,
    });

    useEffect(() => {
        (async () => {
            if (step) {
                const formDetailsData = await getLibraryForm(
                    `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/subject_enrollment_forms`
                );
                if (formDetailsData.data) {
                    setFormConfig(
                        formDetailsData.data.steps.find((_obj) => _obj.key === step)
                    );
                } else if (formDetailsData.error) {
                    console.error("UNABLE TO GET FORM DETAILS");
                }
            }
        })();
    }, [step]);
    useEffect(() => {
        (async () => {
            if (trialSiteinfo) {
                const userRole = getUserRole(
                    loggedInUser,
                    trialId,
                    trialSiteinfo?.siteTrialData?.site?.id
                );
                setUserSiteTrialRole(userRole);
            }
        })();
    }, [trialSiteinfo]);


    return (
        <Dialog
            scroll={"paper"}
            maxWidth={'md'}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DynamicFormEngine
                    formConfig={formConfig}
                    userSiteTrialRole={userSiteTrialRole}
                    showSkeleton={true}
                    hideTab
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default ReadonlyFormDetails;