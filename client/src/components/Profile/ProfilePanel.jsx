import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    Check,
    LogOut,
    Mail,
    UserRound,
    X,
    Edit3,
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfilePanel = ({ onClose }) => {
    const { user, logout, updateProfile, updateProfilePicture } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [uploadingPicture, setUploadingPicture] = useState(false);

    useEffect(() => {
        setName(user?.name || "");
        setBio(user?.bio || "");
    }, [user]);

    const handleLogout = async () => {
        const data = await logout();

        if (data.success) {
            navigate("/");
        }
    };

    // =========================
    // Update profile
    // =========================
    const handleSaveProfile = async () => {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const data = await updateProfile({
                name: name.trim(),
                bio: bio.trim(),
            });

            if (!data.success) {
                setError(data.message);
                return;
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Profile Update Error:", error);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Profile picture
    // =========================
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        try {
            setUploadingPicture(true);
            setError("");

            const data = await updateProfilePicture(file);

            if (!data.success) {
                setError(data.message);
                return;
            }
        } catch (error) {
            console.error("Profile Picture Error:", error);
            setError("Failed to upload profile picture");
        } finally {
            setUploadingPicture(false);
            e.target.value = "";
        }
    };

    return (
        <div className="fixed inset-0 z-50 animate-fade-in bg-black/50 md:flex md:items-center md:justify-center md:p-4">
            <div className="flex
            h-dvh
            w-full
            flex-col
            overflow-hidden
            bg-slate-950
            animate-slide-up

            md:h-[90vh]
            md:max-h-[90vh]
            md:w-full
            md:max-w-md
            md:rounded-2xl
            md:border
            md:border-slate-800
            md:shadow-2xl">
                {/* =========================
                    Header
                ========================= */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900 px-3 sm:px-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
                            aria-label="Close profile"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Profile
                            </h2>

                            <p className="text-[11px] text-slate-500">
                                Your account information
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white md:flex"
                        aria-label="Close profile"
                    >
                        <X size={19} />
                    </button>
                </header>

                {/* =========================
                    Content
                ========================= */}
                <div className="min-h-0 flex-1 overflow-y-auto scrollbar-dark bg-slate-950">
                    {/* =========================
                        Profile Hero
                    ========================= */}
                    <div className="relative flex flex-col items-center border-b border-slate-800/80 px-6 py-8">
                        <div className="relative">
                            {/* Avatar */}
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-800 bg-emerald-600 text-4xl font-bold text-white shadow-xl shadow-black/30">
                                {user?.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.name || "User"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    user?.name?.[0]?.toUpperCase()
                                )}
                            </div>

                            {/* Camera */}
                            <input
                                id="profile-picture-input"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />

                            <label
                                htmlFor="profile-picture-input"
                                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:bg-emerald-500 active:scale-95"
                                aria-label="Change profile picture"
                            >
                                {uploadingPicture ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Camera size={16} />
                                )}
                            </label>
                        </div>

                        {/* Name */}
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-4 w-full max-w-xs rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-center text-lg font-semibold text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Your name"
                            />
                        ) : (
                            <h3 className="mt-4 max-w-full truncate px-4 text-xl font-bold text-white">
                                {user?.name || "User"}
                            </h3>
                        )}

                        {/* Online */}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

                            <span className="text-sm font-medium text-emerald-400">
                                Online
                            </span>
                        </div>
                    </div>

                    {/* =========================
                        Information
                    ========================= */}
                    <div className="space-y-2 px-3 py-4 sm:px-4">
                        {/* Name */}
                        <div className="rounded-xl bg-slate-900 px-4 py-3.5 transition-colors hover:bg-slate-800/80">
                            <div className="flex items-start gap-3">
                                <UserRound
                                    size={19}
                                    className="mt-0.5 shrink-0 text-emerald-500"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                        Name
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-white">
                                        {user?.name || "Not available"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="rounded-xl bg-slate-900 px-4 py-3.5 transition-colors hover:bg-slate-800/80">
                            <div className="flex items-start gap-3">
                                <Mail
                                    size={19}
                                    className="mt-0.5 shrink-0 text-emerald-500"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                        Email
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-white">
                                        {user?.email || "Not available"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="rounded-xl bg-slate-900 px-4 py-3.5 transition-colors hover:bg-slate-800/80">
                            <div className="flex items-start gap-3">
                                <Check
                                    size={19}
                                    className="mt-0.5 shrink-0 text-emerald-500"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                        About
                                    </p>

                                    {isEditing ? (
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                            maxLength={150}
                                            className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            placeholder="Write something about yourself..."
                                        />
                                    ) : (
                                        <p className="mt-1 break-words text-sm leading-relaxed text-slate-300">
                                            {user?.bio || "Hey there! I am using ChatSphere."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        Edit / Save
                    ========================= */}
                    <div className="px-3 sm:px-4">
                        {error && (
                            <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setName(user?.name || "");
                                    setBio(user?.bio || "");
                                    setError("");
                                    setIsEditing(true);
                                }}
                                className="flex mx-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:bg-emerald-500 active:scale-[0.99]"
                            >
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setName(user?.name || "");
                                        setBio(user?.bio || "");
                                        setError("");
                                        setIsEditing(false);
                                    }}
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white disabled:opacity-50"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Check size={18} />

                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* =========================
                        Logout
                    ========================= */}
                    <div className="mt-7 border-t border-slate-800/80 px-3 py-5 sm:px-4">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex mx-auto items-center  justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/15 hover:text-red-300 active:scale-[0.99]"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePanel;