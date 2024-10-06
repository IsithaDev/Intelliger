import { Link } from "react-router-dom";

interface ActionPromptProps {
  question: string;
  answer: string;
  route: string;
}

const ActionPrompt = ({ question, answer, route }: ActionPromptProps) => {
  return (
    <div className="flex items-center gap-x-2 text-sm">
      <p className="font-extralight">{question}</p>
      <Link
        to={route}
        className="font-medium text-primary hover:text-primary/80"
      >
        {answer}
      </Link>
    </div>
  );
};

export default ActionPrompt;
