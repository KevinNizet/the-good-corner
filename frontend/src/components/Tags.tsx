import Link from "next/link";

export type TagsProps = {
  name: string;
  id: number;
};

export function Tags(props: TagsProps): React.ReactNode {
    return(
        <Link href={`/tags/${props.id}`} className="category-navigation-link">
        {props.name}
      </Link> 
    )
}