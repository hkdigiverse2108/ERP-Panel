import { CommonBreadcrumbs } from "../../../Components/Common";
import { ROUTES } from "../../../Constants";
import ChangePasswordForm from "./ChangePasswordForm";

const ChangePassword = () => {
    return (
        <>
            <CommonBreadcrumbs
                title="Change Password"
                maxItems={3}
                breadcrumbs={[
                    { label: "Dashboard", href: ROUTES.DASHBOARD },
                    { label: "Settings", href: ROUTES.SETTINGS.GENERAL },
                    { label: "Change Password" },
                ]}
            />
            <ChangePasswordForm />
        </>
    );
};

export default ChangePassword;
