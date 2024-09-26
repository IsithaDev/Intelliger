import { FC, ReactNode, Suspense } from "react";

const Loading = () => {
  return (
    <main className="flex items-center justify-center flex-1">
      <div className="w-4 h-4 bg-red-500 animate-spin" />
    </main>
  );
};

interface PageLoadingProps {
  children: ReactNode;
}

const PageLoading: FC<PageLoadingProps> = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default PageLoading;
