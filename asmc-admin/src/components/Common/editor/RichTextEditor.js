import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class RichTextEditor extends Component {
    render() {
        return (
            <CKEditor
                editor={ClassicEditor}
                data={this.props.defaultValue}
                config={{
                    toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                    ],
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    this.props.setValue(data);
                }}
            />
        );
    }
}

export default RichTextEditor;
