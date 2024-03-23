import fs from 'fs';

export const updateEnvVariable = (key: string, value: string): void => {
	fs.readFile('.env', 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading .env file:', err);
			return;
		}

		const lines = data.split('\n');

		let updatedContent = '';
		let found = false;
		for (const line of lines) {
			if (line.startsWith(key + '=')) {
				updatedContent += `${key}="${value}"\n`;
				found = true;
			} else {
				updatedContent += line + '\n';
			}
		}

		if (!found) {
			updatedContent += `${key}="${value}"\n`;
		}

		fs.writeFile('.env', updatedContent, err => {
			if (err) {
				return;
			}
		});
	});
};

export const deleteEnvVariable = (keyToDelete: string): void => {
	const envFilePath = '.env';

	// Read the contents of the .env file
	fs.readFile(envFilePath, 'utf8', (err, data) => {
		if (err) {
			return;
		}

		// Split the content into lines
		const lines = data.split('\n');

		// Find and remove the line containing the keyToDelete
		const updatedLines = lines.filter(
			line => !line.startsWith(keyToDelete + '='),
		);

		// Join the remaining lines back together
		const updatedContent = updatedLines.join('\n');

		// Write the updated content back to the .env file
		fs.writeFile(envFilePath, updatedContent, err => {
			if (err) {
				console.error('Error writing to .env file:', err);
				return;
			}
			console.log(`Deleted ${keyToDelete} from .env file.`);
		});
	});
};

export const ensureEnvFileExists = (): void => {
	const envFilePath = '.env';

	fs.access(envFilePath, fs.constants.F_OK, err => {
		if (err) {
			fs.writeFile(envFilePath, '', err => {
				if (err) {
					return;
				}
			});
		} else {
		}
	});
};
