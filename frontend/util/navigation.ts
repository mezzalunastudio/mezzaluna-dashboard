import { useRouter } from "next/navigation";

export let navigate: (path: string) => void;

export const setNavigate = (fn: typeof navigate): void => {
  navigate = fn;
};

export const useGlobalNavigation = () => {
  const router = useRouter();
  setNavigate(router.push);
};
