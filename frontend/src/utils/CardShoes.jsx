import { useNavigate } from 'react-router-dom';

const CardShoes = ({ shoe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`shoes/${shoe?._id}`);
  };

  return (
    <div className="flex flex-col gap-2 cursor-pointer" onClick={handleClick}>
      <img src={shoe?.img[0]} alt={shoe?.name} className="w-90 h-90 object-cover rounded-2xl" />
      <div className="flex flex-col gap-0">
        <span className="font-bold text-xl text-[var(--primary-blue)]">{shoe?.name}</span>
        <span className="font-bold text-md text-[var(--primary-blue)]">{shoe?.gender}</span>
        <span className="font-bold text-md text-[var(--primary-yellow)]">
          {shoe?.price?.toLocaleString('vi-VN')}₫
        </span>
      </div>
    </div>
  );
};

export default CardShoes;
