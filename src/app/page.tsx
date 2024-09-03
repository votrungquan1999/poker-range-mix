import AuthRequiredSection from "src/components/AuthRequiredSection";

export default (async function Home() {
	return (
		<div>
			<AuthRequiredSection>
				<h1>Home</h1>
				<p>Welcome to your new Blitz app!</p>
			</AuthRequiredSection>
		</div>
	);
});
