import React from "react";

export default function Loader() {
  return (
    <div className="mt-5">
  <div className="spinner-border mt-5" role="status" style={{width: "3rem", height: "3rem"}}>
    <span className="sr-only">Loading...</span>
  </div>
</div>

  );
}
