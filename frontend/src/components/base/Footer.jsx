import { Textz } from './Textz';

function Footer() {
  return (
    <>
      <span className="w-full h-[1px] bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-yellow)] rounded-3xl mt-15" />
      <div className="w-full pt-8 pb-15 px-4 grid grid-cols-4">
        <div className="flex flex-col items-start">
          <HeaderFooter>Resources</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>Find A Store</FooterItem>
            <FooterItem>Become A Member</FooterItem>
            <FooterItem>Send Us Feedback</FooterItem>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <HeaderFooter>Help</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>Get Help</FooterItem>
            <FooterItem>Order Status</FooterItem>
            <FooterItem>Delivery</FooterItem>
            <FooterItem>Returns</FooterItem>
            <FooterItem>Payment Options</FooterItem>
            <FooterItem>Contact us</FooterItem>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <HeaderFooter>Company</HeaderFooter>
          <div className="flex flex-col gap-3 justify-start items-start">
            <FooterItem>About us</FooterItem>
            <FooterItem>News</FooterItem>
            <FooterItem>Report a Concern</FooterItem>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

const HeaderFooter = (props) => {
  const { className, ...prop } = props;
  return (
    <Textz className={`${className} !text-[1rem] !font-[600] mb-4`} {...prop}>
      {props.children}
    </Textz>
  );
};

const FooterItem = (props) => {
  const { className, ...prop } = props;
  return (
    <button className={`${className} cursor-pointer text-[0.9rem] font-[600] text-gray-500`} {...prop}>
      {props.children}
    </button>
  );
};
