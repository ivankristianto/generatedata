import * as React from 'react';
import Button from '@material-ui/core/Button';
import { DTMetadata, DTOptionsProps } from '~types/dataTypes';
import { countryList } from '../../../_plugins';
import RadioPill, { RadioPillRow } from '~components/radioPills/RadioPill';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '~components/dialogs';
import Dropdown, { DropdownOption } from '~components/dropdown/Dropdown';
import fullCountryList from './fullCountryList';
import styles from './Country.scss';

export type CountrySource = 'plugins' | 'all';
export type CountryState = {
	source: CountrySource;
	selectedCountries: string[];
}

export const initialState: CountryState = {
	source: 'plugins',
	selectedCountries: []
};

const fullCountryListOptions = fullCountryList.map((countryName) => ({
	value: countryName,
	label: countryName
}));

const CountryDialog = ({ visible, data, id, onClose, countryI18n, onUpdateSource, onUpdateSelectedCountries, coreI18n, i18n }: any): JSX.Element => {
	const countryPluginOptions = countryList.map((countryName) => ({
		value: countryName,
		label: countryI18n[countryName].countryName
	}));

	const onSelectCountries = (countries: any): void => {
		onUpdateSelectedCountries(countries ? countries.map(({ value }: DropdownOption) => value) : []);
	};

	return (
		<Dialog onClose={onClose} open={visible}>
			<div style={{ width: 500 }}>
				<DialogTitle onClose={onClose}>{i18n.selectCountries}</DialogTitle>
				<DialogContent dividers>
					<div>
						{i18n.explanation}
					</div>

					<h3>{i18n.source}</h3>

					<RadioPillRow>
						<RadioPill
							label={`${i18n.countryPlugins} (${countryList.length})`}
							onClick={(): void => onUpdateSource('plugins')}
							name={`${id}-source`}
							checked={data.source === 'plugins'}
							tooltip={i18n.countryPluginsDesc}
						/>
						<RadioPill
							label={`${i18n.allCountries} (${fullCountryList.length})`}
							onClick={(): void => onUpdateSource('all')}
							name={`${id}-source`}
							checked={data.source === 'all'}
						/>
					</RadioPillRow>

					<h3>{i18n.filter}</h3>
					<p>
						{i18n.filterDesc}
					</p>

					<Dropdown
						isMulti
						closeMenuOnSelect={false}
						isClearable={true}
						value={data.selectedCountries}
						onChange={onSelectCountries}
						options={data.source === 'all' ? fullCountryListOptions : countryPluginOptions}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary" variant="outlined">{coreI18n.close}</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export const Options = ({ i18n, coreI18n, countryI18n, id, data, onUpdate }: DTOptionsProps): JSX.Element => {
	const [dialogVisible, setDialogVisibility] = React.useState(false);
	const numSelected = data.selectedCountries.length;

	const onUpdateSource = (source: CountrySource): void => {
		onUpdate({
			source,
			selectedCountries: []
		});
	};

	const onUpdateSelectedCountries = (selectedCountries: string[]): void => {
		onUpdate({
			...data,
			selectedCountries
		});
	};

	let label = '';
	if (data.source === 'all') {
		if (data.selectedCountries.length) {
			label = `<b>${numSelected}</b> ` + ((numSelected === 1) ? i18n.country : i18n.countries);
		} else {
			label = i18n.allCountries;
		}
	} else {
		if (data.selectedCountries.length) {
			label = `<b>${numSelected}</b> ` + ((numSelected === 1) ? i18n.countryPlugin : i18n.countryPlugins);
		} else {
			label = i18n.allCountryPlugins;
		}
	}

	return (
		<div className={styles.buttonLabel}>
			<Button
				onClick={(): void => setDialogVisibility(true)}
				variant="outlined"
				color="primary"
				size="small">
				<span dangerouslySetInnerHTML={{ __html: label }} />
			</Button>
			<CountryDialog
				visible={dialogVisible}
				data={data}
				id={id}
				coreI18n={coreI18n}
				i18n={i18n}
				countryI18n={countryI18n}
				onUpdateSource={onUpdateSource}
				onUpdateSelectedCountries={onUpdateSelectedCountries}
				onClose={(): void => setDialogVisibility(false)}
			/>
		</div>
	);
};

// i18n, data, onUpdate
export const Help = ({ }: DTOptionsProps): JSX.Element => (
	<div />
);

export const getMetadata = (): DTMetadata => ({
	general: {
		dataType: 'string'
	},
	sql: {
		field: 'varchar(100) default NULL',
		field_Oracle: 'varchar2(100) default NULL',
		field_MSSQL: 'VARCHAR(100) NULL'
	}
});
