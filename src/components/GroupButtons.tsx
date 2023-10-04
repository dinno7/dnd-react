interface Props {
	children: React.ReactNode;
}
function GroupButtons({ children }: Props) {
	return <div className="[&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg">{children}</div>;
}

export default GroupButtons;
