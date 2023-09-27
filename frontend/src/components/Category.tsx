export type CategoryProps = {
  name: string;
  id: number;
};

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <a href={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </a>
  );
}
