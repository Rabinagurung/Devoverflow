import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  imageUrl: string;
  href?: string;
  title: string;
}
const ProfileLink = ({ imageUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imageUrl} width={20} height={20} alt={title} />
      {href ? (
        <Link href={href}>
          <p className="paragraph-medium line-clamp-1 break-all">{href}</p>
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700 line-clamp-2 ">
          {title}
        </p>
      )}
    </div>
  );
};

export default ProfileLink;
