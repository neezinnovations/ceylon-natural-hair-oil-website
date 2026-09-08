import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  updateCustomerProfile,
} from "../../services/authService";


export default function ProfilePage() {
  const {
    user,
    profile,
    refreshProfile,
  } = useAuth();


  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
  });


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    saving,
    setSaving,
  ] = useState(false);


  /* ===============================================
     LOAD PROFILE INTO FORM
  ================================================ */

  useEffect(() => {
    setForm({
      name:
        profile?.name || "",

      phone:
        profile?.phone || "",
    });
  }, [
    profile,
  ]);


  /* ===============================================
     HANDLE INPUT
  ================================================ */

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;


      setForm(
        (current) => ({
          ...current,
          [name]: value,
        })
      );


      setMessage("");

      setError("");
    };


  /* ===============================================
     UPDATE PROFILE
  ================================================ */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();


      if (!user?.uid) {
        setError(
          "You must be logged in to update your profile."
        );

        return;
      }


      try {
        setSaving(true);

        setMessage("");

        setError("");


        await updateCustomerProfile(
          user.uid,
          {
            name:
              form.name.trim(),

            phone:
              form.phone.trim(),
          }
        );


        await refreshProfile();


        setMessage(
          "Profile updated successfully."
        );

      } catch (err) {
        console.error(
          "Profile update error:",
          err
        );


        setError(
          err?.message ||
            "Unable to update profile."
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <div className="account-view">

      {/* ===========================================
          PAGE HEADING
      ============================================ */}

      <div className="account-page-heading">

        <span className="account-eyebrow">
          PROFILE
        </span>

        <h1>
          Your details.
        </h1>

        <p>
          Keep your contact information up to date.
        </p>

      </div>


      {/* ===========================================
          SUCCESS
      ============================================ */}

      {message && (
        <div className="account-success">
          {message}
        </div>
      )}


      {/* ===========================================
          ERROR
      ============================================ */}

      {error && (
        <div className="account-error">
          {error}
        </div>
      )}


      {/* ===========================================
          PROFILE FORM
      ============================================ */}

      <form
        className="account-form"
        onSubmit={handleSubmit}
      >

        {/* NAME */}

        <label>

          <span>
            Name
          </span>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
          />

        </label>


        {/* EMAIL */}

        <label>

          <span>
            Email
          </span>

          <input
            type="email"
            value={
              user?.email || ""
            }
            autoComplete="email"
            disabled
          />

          <small>
            Email address cannot be changed here.
          </small>

        </label>


        {/* PHONE */}

        <label>

          <span>
            Phone
          </span>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="07X XXX XXXX"
            autoComplete="tel"
            required
          />

        </label>


        {/* SAVE BUTTON */}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save changes"}
        </button>

      </form>

    </div>
  );
}