import { Row, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { person, social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="8"
        horizontal="center"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
      >
        <Row gap="16" horizontal="center" style={{ marginBottom: 8 }}>
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Row>

        <Text variant="body-default-s" onBackground="neutral-strong" style={{ textAlign: 'center' }}>
          Created by
          <Text as="span" style={{ color: '#0070f3', fontWeight: 600, margin: '0 6px' }}>
            {`@${person.firstName}${person.lastName}`}
          </Text>
          <span style={{ marginLeft: 6 }}>• © {currentYear}</span>
        </Text>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
