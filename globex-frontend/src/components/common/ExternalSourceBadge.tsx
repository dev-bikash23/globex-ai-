interface Props {
  text: string;
}

export function ExternalSourceBadge({ text }: Props) {
  return (
    <span className="external-source-badge" title={text}>
      ℹ️ {text}
    </span>
  );
}
