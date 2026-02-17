import { createFileRoute } from "@tanstack/react-router";
import {
	defaultFilterState,
	mockChannels,
	mockMessages,
} from "@/features/transcript-search/__mocks__/fixtures";
import { TranscriptSearchPagePresenter } from "@/features/transcript-search/components/presenters/TranscriptSearchPagePresenter";

export const Route = createFileRoute("/")({ component: TranscriptSearchPage });

/**
 * Placeholder container for the transcript search page.
 * Will be replaced with a proper container that manages state and data fetching.
 */
function TranscriptSearchPage() {
	return (
		<TranscriptSearchPagePresenter
			channels={mockChannels.filter((ch) => ch.group === "JP").slice(0, 12)}
			filters={defaultFilterState}
			isSidebarOpen={false}
			onSidebarToggle={() => {}}
			onSidebarClose={() => {}}
			onChannelToggle={() => {}}
			onTypeToggle={() => {}}
			onDateChange={() => {}}
			isLoaded={true}
			totalVideos={1847}
			messages={mockMessages}
			inputValue=""
			onInputChange={() => {}}
			onSearch={() => {}}
			isSearchDisabled={false}
		/>
	);
}
