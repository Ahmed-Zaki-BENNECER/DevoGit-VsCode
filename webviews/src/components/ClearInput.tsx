type ClearInputPropsType = {
    onClick: () => void;
    displayed: boolean;
};

const css = `
:root {
    --clear-icon-stroke-width: 1px;
    --clear-icon-size: 20px;
    --clear-icon-padding: calc(var(--clear-icon-size) * 0.5);
    --search-input-padding-right: calc(var(--clear-icon-size) + var(--clear-icon-padding) * 2);
    --clear-icon-internal-padding: calc(0.15 * var(--clear-icon-size));
}

.input-clear-button {
    width: var(--clear-icon-size);
    height: var(--clear-icon-size);
    position: absolute;
    right: var(--clear-icon-padding);
    top: calc(50% - var(--clear-icon-size) / 2);
    borderRadius: 50%;
    cursor: pointer;

    transform:rotate(45deg);
    -ms-transform:rotate(45deg); /* IE 9 */
    -webkit-transform:rotate(45deg); /* Safari and Chrome */
}

.input-clear-button:before, .input-clear-button:after {
    content: "";
    position: absolute;
    background: var(--vscode-input-foreground);
}
.input-clear-button:before {
    left: 50%;
    width: var(--clear-icon-stroke-width);
    margin-left: calc(-1 * var(--clear-icon-stroke-width) / 2);
    height: calc(100% - 2 * var(--clear-icon-internal-padding));
    top: var(--clear-icon-internal-padding);
}
.input-clear-button:after {
    top: 50%;
    height: var(--clear-icon-stroke-width);
    margin-top: calc(-1 * var(--clear-icon-stroke-width) / 2);
    width: calc(100% - 2 * var(--clear-icon-internal-padding));
    left: var(--clear-icon-internal-padding);
}

.input-clear-button:hover {
    filter: brightness(1.3);
`;

function ClearInput({ onClick, displayed }: ClearInputPropsType) {
    return (
        <>
            <style>{css}</style>
            {displayed && <div className='input-clear-button' onClick={onClick} />}
        </>
    );
}

export default ClearInput;
