function Loader({ centered }: { centered?: boolean }) {
  if (centered)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );

  return <span className="loading loading-spinner loading-md"></span>;
}

export default Loader;
