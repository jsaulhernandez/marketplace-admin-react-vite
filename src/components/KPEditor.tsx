import { FC } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import styled from 'styled-components';

import { formats, modules } from '@utils/EditorToolbar.utils';

export interface KPEditorProps {
    value?: string;
    onSetValue?: (value: string) => void;
    required?: boolean;
    onSetRequired?: (value: boolean) => void;
}

const KPEditor: FC<KPEditorProps> = (props) => {
    return (
        <EditorWrapper required={props.required}>
            <ReactQuill
                modules={modules}
                formats={formats}
                className="kp-editor"
                theme="snow"
                value={props.value}
                onChange={(e) => {
                    props.onSetValue && props.onSetValue(e);
                    props.onSetRequired && props.onSetRequired(false);
                }}
            />
            {props.required && (
                <div className="ant-form-item-explain-error">Este campo es requerido</div>
            )}
        </EditorWrapper>
    );
};

const EditorWrapper = styled.div<{ required?: boolean }>`
    margin-bottom: 40px;
    position: relative;

    .kp-editor {
        display: flex;
        flex-direction: column;

        .ql-editor {
            min-height: 250px;
        }
    }

    .ant-form-item-explain-error {
        color: #ff4d4f;
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
        border: 1px solid ${({ required }) => (required ? '#ff4d4f' : '#ccc')};
    }
`;

export default KPEditor;
