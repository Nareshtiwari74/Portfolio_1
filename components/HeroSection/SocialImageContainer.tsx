import Image from "next/image";

const SocialImageContainer = ({ image }: { image: string }) => {
  return (
    <div className="border-line-strong/90 w-fit overflow-hidden rounded-3xl border-2">
      <Image
        src={image}
        alt="social image"
        width={300}
        height={300}
        loading="eager"
        className="rounded-2xl"
      />
    </div>
  );
};

export default SocialImageContainer;
