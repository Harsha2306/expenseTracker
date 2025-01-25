import { memo } from "react";
import { Link } from "react-router-dom";

interface GreetingProps {
  username: string;
}

const Greeting: React.FC<GreetingProps> = memo(({ username }) => {
  const currentHour = new Date().getHours();

  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-extrabold text-white mb-4">
        {`${greeting}, ${username}`}
      </h1>
      <Link
        to="/transaction"
        className="px-6 py-2 bg-blue-600 text-white text-md font-semibold rounded-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-md"
      >
        Add New Transaction
      </Link>
    </div>
  );
});

export default Greeting;
