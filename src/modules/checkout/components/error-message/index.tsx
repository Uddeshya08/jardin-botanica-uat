const ErrorMessage = ({
  error,
  "data-testid": dataTestid,
}: {
  error?: string | null
  "data-testid"?: string
}) => {
  if (!error) {
    return null
  }

  // Remove "Error: " prefix safely
  const cleanedError =
    typeof error === "string"
      ? error.replace(/^Error:\s*/i, "")
      : error

  return (
    <div
      className="pt-2 text-rose-500 text-small-regular"
      data-testid={dataTestid}
    >
      <span>{cleanedError}</span>
    </div>
  )
}

export default ErrorMessage
