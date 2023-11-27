import React from "react";
import { Steps } from "../../../contexts/stepContext";
import styles from "./StepComponent.module.css";

interface Props {
    step: Steps;
    title: string;
    complete: boolean;
    isActiveStep: boolean;
    handleChange?: (step: Steps) => void;
    image: string;
}

const StepComponent = ({
    step,
    title,
    complete,
    isActiveStep,
    handleChange,
    image,
}: Props) => {
    return (
        <div
            className={
                isActiveStep
                    ? styles.row
                    : complete
                    ? styles.row
                    : styles.rowInactive
            }
            onClick={() => handleChange(step)}
        >
            <div
                className={
                    isActiveStep ? styles.activeLogo : styles.inactiveLogo
                }
            >
                <img
                    className={styles.companyLogo}
                    src={image}
                    alt=""
                    width={30}
                    height={30}
                />
            </div>
            <h3>{title}</h3>
        </div>
    );
};

export default StepComponent;
