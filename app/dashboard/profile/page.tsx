import { getProfile } from "@/lib/actions/profile";

import ProfileForm from "./_components/ProfileForm";
import ChangePasswordForm from "./_components/ChangePasswordForm";

export default async function ProfilePage() {
    const user = await getProfile();

    return (
        <div className="space-y-8">
            <ProfileForm user={user} />

            <ChangePasswordForm />
        </div>
    );
}