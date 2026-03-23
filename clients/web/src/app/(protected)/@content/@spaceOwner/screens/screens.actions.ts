"use server";

import gql from "@/api/server/gql";
import { gql as gqlTag } from "@apollo/client";
import { revalidatePath } from "next/cache";

// ── Types ────────────────────────────────────────────────

export interface ScreenActionState {
  success: boolean;
  message: string;
}

type RegisterScreenData = {
  registerDigitalSignageScreen: {
    createDigitalSignageScreenPayload: {
      screen: { id: string; name: string };
    } | null;
    errors: Array<{ message: string }> | null;
  } | null;
};
type RegisterScreenVars = {
  input: { input: { spaceId: string; name: string; resolution?: string } };
};

type GeneratePairingCodeData = {
  generateDevicePairingCode: {
    generatePairingCodePayload: {
      pairingCode: string;
      expiresAt: string;
    } | null;
    errors: Array<{ message: string }> | null;
  } | null;
};
type GeneratePairingCodeVars = { input: { input: { screenId: string } } };

// ── Mutations ────────────────────────────────────────────

const REGISTER_SCREEN_MUTATION = gqlTag`
  mutation RegisterDigitalSignageScreen(
    $input: RegisterDigitalSignageScreenInput!
  ) {
    registerDigitalSignageScreen(input: $input) {
      createDigitalSignageScreenPayload {
        screen {
          id
          name
        }
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

const GENERATE_PAIRING_CODE_MUTATION = gqlTag`
  mutation GenerateDevicePairingCode($input: GenerateDevicePairingCodeInput!) {
    generateDevicePairingCode(input: $input) {
      generatePairingCodePayload {
        pairingCode
        expiresAt
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

// ── Actions ──────────────────────────────────────────────

export async function registerScreenAction(
  _prevState: ScreenActionState,
  formData: FormData
): Promise<ScreenActionState> {
  const spaceId = formData.get("spaceId")?.toString()?.trim() ?? "";
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const resolution = formData.get("resolution")?.toString()?.trim() || null;

  if (!spaceId || !name) {
    return {
      success: false,
      message: "Space and screen name are required.",
    };
  }

  try {
    const result = await gql.mutate<RegisterScreenData, RegisterScreenVars>({
      mutation: REGISTER_SCREEN_MUTATION,
      variables: {
        input: {
          input: {
            spaceId,
            name,
            ...(resolution && { resolution }),
          },
        },
      },
    });

    const payload = result.data?.registerDigitalSignageScreen;
    const error = payload?.errors?.find(Boolean)?.message;
    if (error) {
      return { success: false, message: error };
    }

    if (!payload?.createDigitalSignageScreenPayload?.screen?.id) {
      return { success: false, message: "Failed to register screen." };
    }

    revalidatePath("/screens");
    return {
      success: true,
      message: `Screen "${name}" registered successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to register screen.",
    };
  }
}

export async function generatePairingCodeAction(
  screenId: string
): Promise<{ success: boolean; pairingCode?: string; expiresAt?: string; error?: string }> {
  try {
    const result = await gql.mutate<GeneratePairingCodeData, GeneratePairingCodeVars>({
      mutation: GENERATE_PAIRING_CODE_MUTATION,
      variables: { input: { input: { screenId } } },
    });

    const payloadWrapper = result.data?.generateDevicePairingCode;
    const errorMsg = payloadWrapper?.errors?.find(Boolean)?.message;
    if (errorMsg) {
      return { success: false, error: errorMsg };
    }

    const payload = payloadWrapper?.generatePairingCodePayload;
    if (!payload?.pairingCode) {
      return { success: false, error: "Failed to generate pairing code." };
    }

    return {
      success: true,
      pairingCode: payload.pairingCode,
      expiresAt: payload.expiresAt,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate pairing code.",
    };
  }
}
