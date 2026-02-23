import { CommonBreadcrumbs } from "../../../Components/Common";
import ChangePasswordForm from "./ChangePasswordForm";

const ChangePassword = () => {
    return (
        <>
            <CommonBreadcrumbs
                title="Change Password"
                maxItems={3}
                breadcrumbs={[
                    { label: "Change Password" },
                ]}
            />
            <ChangePasswordForm />
        </>
    );
};

export default ChangePassword;
