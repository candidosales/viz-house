import { render, screen } from '@testing-library/react';

import {
    TimeSeriesChart,
    TimeSeriesSeriesDescriptor
} from '@/components/TimeSeriesChart';
import ClickUIWrapper from '@/lib/ClickUIWrapper';

describe('TimeSeriesChart', () => {
    it('renders without crashing', () => {
        const date1 = new Date('January 1, 2024');
        const date2 = new Date('February 01, 2024');

        const series: Array<TimeSeriesSeriesDescriptor> = [
            {
                name: 'Test Series',
                type: 'line',
                values: [
                    { x: date1.valueOf(), y: 10928 },
                    { x: date2.valueOf(), y: 22873 }
                ]
            }
        ];

        render(
            <ClickUIWrapper>
                <TimeSeriesChart series={series} />
            </ClickUIWrapper>
        );

        // Check that the chart is rendered by looking for the chart container
        expect(screen.getByRole('region', { name: /chart/i })).toBeInTheDocument();

        // Check for accessibility information that contains our data values
        expect(screen.getByText(/10928/)).toBeInTheDocument();
        expect(screen.getByText(/22873/)).toBeInTheDocument();
    });

    it('displays loading when isLoading is true', () => {
        const series: Array<TimeSeriesSeriesDescriptor> = [
            {
                name: 'Test Series',
                type: 'line',
                values: [
                    { x: new Date('2024-01-01').valueOf(), y: 10928 },
                    { x: new Date('2024-02-05').valueOf(), y: 22873 }
                ]
            }
        ];

        render(
            <ClickUIWrapper>
                <TimeSeriesChart series={series} isLoading />
            </ClickUIWrapper>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
});
