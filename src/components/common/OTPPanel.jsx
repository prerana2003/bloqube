import React, { useEffect, useState } from "react";
import { MuiOtpInput } from 'mui-one-time-password-input'
import { Box, Button } from "@mui/material";
import CustomButton from "../@extended/CustomButton";
import { useResendOTPValueMutation } from "../../store/slices/apiSlice";
import { useResponsive } from "../../hooks/ResponsiveProvider";
//import "./App.css";

function OTPPanel({otpVerified}) {
    // State variables to manage OTP input, minutes, and seconds
    const [otp, setOtp] = useState("");
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(59);
    const {isSmallScreen} = useResponsive();
    const [resendOTPValue]=useResendOTPValueMutation()
    useEffect(() => {
        // Function to handle the countdown logic
        const interval = setInterval(() => {
            // Decrease seconds if greater than 0
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            // When seconds reach 0, decrease minutes if greater than 0
            if (seconds === 0) {
                if (minutes === 0) {
                    // Stop the countdown when both minutes and seconds are 0
                    clearInterval(interval);
                } else {
                    // Reset seconds to 59 and decrease minutes by 1
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000); // Run this effect every 1000ms (1 second)

        return () => {
            // Cleanup: stop the interval when the component unmounts
            clearInterval(interval);
        };
    }, [seconds]); // Re-run this effect whenever 'seconds' changes

    // Function to resend OTP
    const resendOTP =async () => {
        const val = await resendOTPValue()
        if (val.data) {
        setMinutes(1);
        setSeconds(59);
        }
    };
    const handleChange = (newValue) => {
        setOtp(newValue)
    }

    return (
        <Box sx={{
            display: 'flex',
            width:isSmallScreen?'90%':'30%',
            flexDirection: 'column',
            alignItems: 'center',
            justifycontent: 'center'
        }}>
            <Box sx={{ padding: 1, borderRadius: 10 }}>
                {/* <h4>Verify OTP</h4> */}

                {/* Input field for entering OTP */}
                {/* <input
          placeholder="Enter OTP"
          value={otp}
          onChange={({ target }) => {
            setOtp(target.value);
          }}
        /> */}
                <MuiOtpInput value={otp} onChange={handleChange} />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '8px 0px'
                }}>
                    {/* Display countdown timer if seconds or minutes are greater than 0 */}

                    {seconds > 0 || minutes > 0 ? (
                        <p>
                            Time Remaining:{" "}
                            <span style={{ fontWeight: 600 }}>
                                {minutes < 10 ? `0${minutes}` : minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds}
                            </span>
                        </p>
                    ) : (
                        // Display if countdown timer reaches 0
                        <p>Didn't receive code?</p>
                    )}

                    {/* Button to resend OTP */}
                    <Button
                        disabled={seconds > 0 || minutes > 0}
                        sx={{
                            color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
                            textDecoration:'underline'
                        }}
                        onClick={resendOTP}
                    >
                        Resend OTP
                    </Button>
                </Box>

                {/* Button to submit OTP */}
                <Box sx={{ display:'flex', justifyContent:'end' }}><CustomButton disabled={!otp || otp.length < 4} variant="contained" onClick={() => otpVerified(otp)}>Verify OTP</CustomButton></Box>
            </Box>
        </Box>
    );
}

export default OTPPanel;
