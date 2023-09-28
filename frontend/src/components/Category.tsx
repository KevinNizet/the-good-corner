import Link from "next/link";

export type CategoryProps = {
  name: string;
  id: number;
};

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <Link href={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </Link>
  );
}
