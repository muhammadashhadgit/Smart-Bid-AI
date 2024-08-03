import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/viewadminprofile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status === "success") {
          setAdminData(response.data.data);
        } else {
          setError("Error fetching admin profile");
        }
      } catch (err) {
        setError("Error fetching admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Profile</h1>
        {adminData ? (
          <>
            <p style={styles.text}>
              <strong>First Name:</strong> {adminData.firstName}
            </p>
            <p style={styles.text}>
              <strong>Last Name:</strong> {adminData.lastName}
            </p>
            <p style={styles.text}>
              <strong>Email:</strong> {adminData.emailAddress}
            </p>
            <p style={styles.text}>
              <strong>Wallet Balance:</strong> ${adminData.wallet}
            </p>
          </>
        ) : (
          <p style={styles.text}>No data available</p>
        )}
        <button style={styles.button} onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    margin: "0.5rem 0",
    fontSize: "16px",
    color: "#555",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  loading: {
    textAlign: "center",
    marginTop: "2rem",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: "2rem",
  },
};

export default AdminProfile;
