import upfetch from "@/api/instance.ts";
import { IKContext, IKUpload } from "imagekitio-react";
import { Paperclip } from "lucide-react";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
import toast from "react-hot-toast";
import type { DbData, IImage } from "../types";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  const data = await upfetch("/upload", {
    onError: (error, request) => {
      toast.error(`Request failed: ${request.text()}`);
      if (error instanceof TypeError) {
        throw new Error(`Authentication request failed: ${error.message}`);
      }
    },
  });

  const { signature, expire, token } = data;
  return { signature, expire, token };
};

interface IProps {
  setImg: Dispatch<SetStateAction<IImage>>;
}

const Upload = ({ setImg }: IProps) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const onError = (err: string) => {
    console.log("Error", err);
  };

  const onSuccess = (res: DbData) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress: number) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (!file) return;

    setImg((prev) => ({
      ...prev,
      isLoading: true,
      file,
    }));
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      {
        <label onClick={() => ikUploadRef.current?.click()}>
          <Paperclip size={16} />
        </label>
      }
    </IKContext>
  );
};

export default Upload;
