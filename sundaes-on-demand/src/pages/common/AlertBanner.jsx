import Alert from "react-bootstrap/Alert";

export default function AlertBanner({ message, variant }) {
  const alertMessage =
    message || "An expected error occured. Please try again.";

  const alertVarint = variant || "danger";

  return (
    <Alert variant={alertVarint} style={{ backgroundColor: "red" }}>
      {alertMessage}
    </Alert>
  );
}
