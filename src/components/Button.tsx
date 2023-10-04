interface ButtonProps {
	children: React.ReactNode | string;
	icon?: React.ReactNode | null;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
function Button({ children, icon = null, onClick }: ButtonProps): React.ReactNode {
	return (
		<button
			className="flex items-center justify-start gap-2 p-3 rounded-md bg-columnBackgroundColor text-slate-50"
			onClick={onClick}>
			{icon}
			{icon ? <span>{children}</span> : <>{children}</>}
		</button>
	);
}

export default Button;
