import { useEffect, useState } from "react";
import { fetchFunctionData } from "../../services/Services";
import { ProgressSpinner } from "primereact/progressspinner";

const TestPage = () => {
  const [functionData, setFunctionData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedAzure = await fetchFunctionData();
        setFunctionData(fetchedAzure);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  if (loading) {
    return (
      <div>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>{functionData}</div>;
};

export default TestPage;
