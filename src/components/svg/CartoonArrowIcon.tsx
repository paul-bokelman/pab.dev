interface Props {
  className: string;
  color: string;
}

export const CartoonArrowIcon: React.FC<Props> = ({ className, color }) => {
  return (
    <svg className={className} viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 2.5C4.29585 3.63387 11.0202 9.64501 12.5 10.5C16.5 13.5 24.1993 15.731 28.9157 15.731"
        stroke={color}
        stroke-width="3"
        stroke-linecap="round"
      />
      <path d="M3 2C5.82408 2 8.51339 3.4486 11.2777 3.4486" stroke={color} stroke-width="3" stroke-linecap="round" />
      <path
        d="M2.47021 10.4033C1.96855 7.62416 2.91637 4.72029 2.42532 1.99995"
        stroke={color}
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  );
};
