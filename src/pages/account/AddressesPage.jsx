import { getErrorMessage } from "../../utils/errors";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../services/addressService";

const EMPTY = {
  label: "Home",
  fullName: "",
  phone: "",
  phone2: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  postalCode: "",
};

export default function AddressesPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (user?.uid) {
      setAddresses(await getAddresses(user.uid));
    }
  }, [user]);

  useEffect(() => {
    load().catch((err) => setError(getErrorMessage(err, "Unable to load addresses. Please reload to try again.")));
  }, [load]);

  function openNew() {
    setEditing("new");
    setForm(EMPTY);
  }

  function openEdit(address) {
    setEditing(address.id);
    setForm(address);
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      setError("");

      if (editing === "new") {
        await addAddress(user.uid, form);
      } else {
        await updateAddress(user.uid, editing, form);
      }

      setEditing(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save address. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this address?")) {
      return;
    }

    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (profile?.defaultAddressId === id) {
        await setDefaultAddress(user.uid, null);
        await refreshProfile();
      }
      await deleteAddress(user.uid, id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete the address. Please reload and try again."));
    } finally {
      setBusy(false);
    }
  }

  async function makeDefault(id) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await setDefaultAddress(user.uid, id);
      await refreshProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to change the default address. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  const fields = {
    label: "Label",
    fullName: "Full name",
    phone: "Phone",
    phone2: "Second phone",
    addressLine1: "Address line 1",
    addressLine2: "Address line 2",
    city: "City",
    district: "District",
    postalCode: "Postal code",
  };

  const requiredFields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "district",
  ];

  return (
    <div className="account-view">
      <div className="account-title-row">
        <div>
          <span className="account-eyebrow">DELIVERY</span>
          <h1>Saved addresses.</h1>
        </div>

        <button disabled={busy} onClick={openNew}>+ Add address</button>
      </div>

      {error && <div className="account-error">{error}</div>}

      <div className="address-grid">
        {addresses.map((address) => (
          <article key={address.id}>
            <span>
              {address.label}
              {profile?.defaultAddressId === address.id
                ? " · Default"
                : ""}
            </span>

            <strong>{address.fullName}</strong>

            <p>
              {address.addressLine1}
              {address.addressLine2
                ? `, ${address.addressLine2}`
                : ""}
              <br />
              {address.city}, {address.district}
              <br />
              {address.phone}
            </p>

            <div>
              <button disabled={busy} onClick={() => openEdit(address)}>
                Edit
              </button>

              {profile?.defaultAddressId !== address.id && (
                <button disabled={busy} onClick={() => makeDefault(address.id)}>
                  Make default
                </button>
              )}

              <button disabled={busy} onClick={() => remove(address.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <div className="account-modal-wrap">
          <div className="account-modal">
            <header>
              <h2>
                {editing === "new"
                  ? "Add address"
                  : "Edit address"}
              </h2>

              <button disabled={busy} onClick={() => setEditing(null)}>
                ×
              </button>
            </header>

            <form onSubmit={save}>
              {Object.entries(fields).map(([key, label]) => (
                <label key={key}>
                  {label}

                  <input
                    required={requiredFields.includes(key)}
                    value={form[key] || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [key]: event.target.value,
                      })
                    }
                  />
                </label>
              ))}

              <button disabled={busy}>{busy ? "Saving..." : "Save address"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
